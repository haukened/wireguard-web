export type Token = {
    value: string,
    email: string,
    firstname: string,
    lastname: string,
}

export type Message = {
    text: string | undefined,
    token: Token | undefined,
}