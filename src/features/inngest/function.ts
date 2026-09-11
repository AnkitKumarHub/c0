// src/inngest/functions.ts
import z from "zod"
import { prisma } from "@/lib/db";
import { inngest } from "./client";
import { Sandbox } from "@e2b/code-interpreter"
import { MessageRole, MessageType } from "@/generated/prisma/enums";
import { createAgent, createNetwork, createState, createTool, openai } from '@inngest/agent-kit'
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/lib/prompt";
import { agentOutputText, connectSandbox, lastAssistantTextMessageContent } from "./utils";

export interface CodeAgentState {
  sandboxId: string;
  summary: string;
  files: Record<string, string>
}

// Next dev refuses to serve /_next/* to any host outside its allowlist, which
// would 403 the client bundle when the preview is reached over the E2B domain.
const SANDBOX_NEXT_CONFIG = `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.e2b.app", "**.e2b.app", "*.e2b.dev", "**.e2b.dev"],
};

export default nextConfig;
`;

async function probeSandboxPreview(sandboxId: string) {
  const sandbox = await connectSandbox(sandboxId);
  const host = sandbox.getHost(3000);
  const publicUrl = `https://${host}`;

  async function run(command: string) {
    const result = await sandbox.commands.run(command, { timeoutMs: 60_000 });
    return result.stdout.trim();
  }

  try {
    const localStatus = await run(
      'curl -s -L -o /tmp/preview-local.html -w "%{http_code}" --max-time 30 http://localhost:3000/ || echo 000'
    );
    const publicStatus = await run(
      `curl -s -L -o /tmp/preview-public.html -w "%{http_code}" --max-time 30 ${publicUrl}/ || echo 000`
    );
    const publicHtml = await sandbox.files.read("/tmp/preview-public.html");
    const chunk =
      publicHtml.match(/\/_next\/static\/chunks\/[^"]+\.js/)?.[0] ?? "";
    const localAssetStatus = chunk
      ? await run(
          `curl -s -L -o /dev/null -w "%{http_code}" --max-time 30 "http://localhost:3000${chunk}" || echo 000`
        )
      : "000";
    const publicAssetStatus = chunk
      ? await run(
          `curl -s -L -o /dev/null -w "%{http_code}" --max-time 30 "${publicUrl}${chunk}" || echo 000`
        )
      : "000";
    const output = `local=${localStatus} public=${publicStatus} chunk=${chunk || "none"} localAsset=${localAssetStatus} publicAsset=${publicAssetStatus}`;

    return {
      ok:
        localStatus === "200" &&
        publicStatus === "200" &&
        publicAssetStatus === "200",
      output,
      url: publicUrl,
    };
  } catch (error) {
    return {
      ok: false,
      output: `probe failed: ${error}`,
      url: publicUrl,
    };
  }
}

export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const result = await step.run("handle-task", async () => {
      return { processed: true, id: event.data.id };
    });

    await step.sleep("pause", "1s");

    return { message: `Task ${event.data.id} complete`, result };
  }
);

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent", triggers: { event: "code-agent/run" } },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create({
        template: "xxf1re4gzsjkruurieg4",
        timeoutMs: 1000 * 60 * 60 * 1, // 1 hour,
        lifecycle: {
          onTimeout: "pause",   // pause instead of kill
          autoResume: true,     // wake up when URL is hit again
        },
      })
      return sandbox.sandboxId  // grabbing the sandbox id 
    })

    await step.run("prepare-sandbox", async () => {
      const sandbox = await connectSandbox(sandboxId);
      await sandbox.files.write("next.config.ts", SANDBOX_NEXT_CONFIG);
      return { patched: true };
    })

    const previousMessages = await step.run("get-previous-messages", async () => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: event.data.projectId
        },
        orderBy: {
          createdAt: "asc"
        }
      });

      return messages.map((message) => ({
        type: "text" as const,
        role:
          message.role === MessageRole.ASSISTANT
            ? ("assistant" as const)
            : ("user" as const),
        content: message.content,
      }))
    })

    const state = createState<CodeAgentState>(
      { sandboxId, summary: "", files: {} },
      { messages: previousMessages }
    )

    const geminiModel = openai({
      model: "gpt-5-mini",
      step,
      apiKey: process.env.OPENAI_API_KEY!,
      defaultParameters: {
        temperature: 1
        // generationConfig: {
        //   temperature: 0.5,
        //   maxOutputTokens: 8192,
        // }
      }
    } as Parameters<typeof openai>[0]
    )

    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: geminiModel,
      tools: [
        // 1. Terminal
        createTool({
          name: "terminal",
          description: "use the terminal to run",
          parameters: z.object({ command: z.string() }),
          handler: async ({ command }, { step }) => {
            return await step?.run(`terminal-${command}`, async () => { //-ve
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await Sandbox.connect(sandboxId);

                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },

                  onStderr: (data) => {
                    buffers.stderr += data;
                  },
                });

                return result.stdout;
              } catch (error) {
                console.log(
                  `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`
                );

                return `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        // 2. createOrUpdateFiles
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox. call this tool once per file with a relative path and full file contents",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = network?.state?.data.files || {};

                  const sanbox = await Sandbox.connect(sandboxId);

                  for (const file of files) {
                    await sanbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }

                  return updatedFiles;
                } catch (error) {
                  return "Error" + error;
                }
              }
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
        // 3. readFiles
        createTool({
          name: "readFiles",
          description: "Read files in the sandbox",

          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sanbox = await Sandbox.connect(sandboxId);

                const contents: Array<{ path: string; content: string }> = [];
                console.log(contents)

                for (const file of files) {
                  const content = await sanbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return "Error" + error;
              }
            });
          },
        }),
      ],

      // to use the tool we have to add lifeCycle -> which will decide when to stop 
      lifecycle: {
        onResponse: async ({ result, network }) => {
          console.log(result);
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      }
    })

    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }
        return codeAgent;
      }
    });

    const result = await network.run(event.data.value, { state });
    console.log(result)
    const { summary, files } = result.state.data;

    const makeTextAgent = (name: string, system: string) => createAgent({ name, system, model: geminiModel });

    const fragmentTitleGenerator = makeTextAgent("fragment-title-generator", FRAGMENT_TITLE_PROMPT);
    const responseGenerator = makeTextAgent("response-generator", RESPONSE_PROMPT);

    const [{ output: fragmentTitleOutput }, { output: responseOutput }] = await Promise.all([
      fragmentTitleGenerator.run(summary, { step }),
      responseGenerator.run(summary, { step })
    ]);

    const fragmentTitle = agentOutputText(fragmentTitleOutput, "Untitled");
    const responseText = agentOutputText(responseOutput, "Here you go");

    console.log(files)

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;


    const previewProbe = await step.run("probe-preview", async () => {
      const probe = await probeSandboxPreview(sandboxId);
      console.log(`[sandbox ${sandboxId}] preview probe: ${probe.output}`);
      return probe;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. Please try again",
            role: MessageRole.ASSISTANT,
            type: MessageType.ERROR,
          },
        })
      };

      return prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: previewProbe.ok
            ? responseText
            : `${responseText}\n\nPreview check warning: ${previewProbe.output}`,
          role: MessageRole.ASSISTANT,
          type: MessageType.RESULT,
          fragments: {
            create: {
              sandboxId,
              sandboxUrl: previewProbe.url,
              title: fragmentTitle,
              files
            }
          }
        }
      })
    });

    return {
      url: previewProbe.url, title: fragmentTitle, files, summary, preview: previewProbe
    }
  }
)
