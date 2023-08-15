import clc from 'cli-color'
import winston from 'winston'

export interface LoggerConfig {
    level: string
    loggers: string[]
    timeFormat: string
}

export class LoggerService {
    private readonly logger: winston.Logger
    private requestId: string
    private context: string

    constructor(config: LoggerConfig) {
        const transports = []

        if (config.loggers && config.loggers.indexOf('console') >= 0) {
            transports.push(new winston.transports.Console())
        }

        this.logger = winston.createLogger({
            level: config.level,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: config.timeFormat,
                }),
                this.getLoggerFormat(),
            ),
            transports,
        })
    }

    public setRequestId(id: string): void {
        this.requestId = id
    }

    public getRequestId(): string {
        return this.requestId
    }

    public setContext(ctx: string): void {
        this.context = ctx
    }

    public log(msg: string, context?: string): void {
        this.info(msg, context)
    }

    public debug(msg: string, context?: string): void {
        this.logger.debug(msg, [ { context, reqId: this.requestId } ])
    }

    public info(msg: string, context?: string): void {
        if (typeof process.env.JEST !== 'undefined') {
            return
        }
        this.logger.info(msg, [ { context, reqId: this.requestId } ])
    }

    public warn(msg: string, context?: string): void {
        this.logger.warn(msg, [ { context, reqId: this.requestId } ])
    }

    public error(msg: string, context?: string): void {
        this.logger.error(msg, [ { context, reqId: this.requestId } ])
    }

    private getLoggerFormat(): winston.Logform.Format {
        return winston.format.printf(info => {
            let reqId = ''
            let context = ''
            if (info['0']) {
                const meta = info['0'] as { reqId?: string; context?: string}

                if (meta.reqId) {
                    reqId = clc.cyan(`[${meta.reqId}]`)
                }

                context = meta.context || this.context || null
            }

            return `${info.timestamp} [${context}]${reqId} ${info.message}`
        })
    }
}
