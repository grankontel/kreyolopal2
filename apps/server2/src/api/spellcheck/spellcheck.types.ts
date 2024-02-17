export enum KreyolLang {
  GP = 'GP',
  MQ = 'MQ',
}

export interface DicoRequest {
  kreyol: KreyolLang
  request: string
}

export type DicoFile = {
  affix: Buffer | string
  dictionary: Buffer | string
}

export interface DicoFileReader {
  readDicoFiles: (kreyol: KreyolLang) => Promise<DicoFile>
}

export enum MessageStatus {
  success = 'success',
  warning = 'warning',
  error = 'error',
}

export type MessageResponse = {
  id?: undefined
  user?: string
  // status: '', success | warning | error
  status: MessageStatus
  kreyol: KreyolLang // message.request.kreyol,
  unknown_words: string[]
  message: string
  user_evaluation: undefined
  admin_evaluation: undefined
}
