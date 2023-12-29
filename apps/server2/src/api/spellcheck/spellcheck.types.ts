export enum KreyolLang {
  GP = 'GP',
  MQ = 'MQ',
}

type DicoRequest = {
  kreyol: KreyolLang
  request: string
}

type DicoFile = {
  affix: Buffer
  dictionary: Buffer
}

type DicoFileReader = {
  readDicoFiles: (kreyol: KreyolLang) => Promise<DicoFile>
}

export enum MessageStatus  {
    success = 'success',
    warning = 'warning',
    error = 'error'
}

type MessageResponse = {
    // status: '', success | warning | error
    status: MessageStatus,
    kreyol: KreyolLang, // message.request.kreyol,
    unknown_words: string[],
    message: string,
    user_evaluation: undefined,
    admin_evaluation: undefined,
  }