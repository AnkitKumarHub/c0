
import { Template, defaultBuildLogger } from 'e2b'
import { template as nextJSTemplate } from './template'
import "dotenv/config"

const apiKey = process.env.E2B_API_KEY

if (!apiKey) {
    throw new Error("E2B_API_KEY is not set. Add it to .env before building the template.")
}

Template.build(nextJSTemplate , "c0-build" , {
    cpuCount: 4,
    memoryMB: 4096,
    onBuildLogs: defaultBuildLogger(),
    apiKey:"e2b_8510b43e0ad0b9f7a7053bf8a976b8e56badf60c"
})