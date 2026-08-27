
import { Template, defaultBuildLogger } from 'e2b'
import { template as nextJSTemplate } from './template'
import "dotenv/config"

console.log(process.env.E2B_API_KEY)


Template.build(nextJSTemplate , "c0-build" , {
    cpuCount: 4,
    memoryMB: 4096,
    onBuildLogs: defaultBuildLogger(),
    apiKey:"e2b_8510b43e0ad0b9f7a7053bf8a976b8e56badf60c"
})