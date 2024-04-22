'use client'

export async function checkWord(token: string, entry: string): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    await fetch(`/api/dictionary/check/${entry}`, {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 },
    })
      .then(function (response) {
        resolve(response.ok)
      })
      .catch(function (error) {
        console.log("Il y a eu un problème avec l'opération fetch : " + error.message)
        reject(error)
      })
  })
}
