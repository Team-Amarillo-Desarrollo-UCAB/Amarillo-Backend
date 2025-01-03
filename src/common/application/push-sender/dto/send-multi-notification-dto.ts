export interface PushMulticastDto {
    token: string[]
    notification: {
        title: string
        body: string
        icon?: string
    }
}