import type { NextApiRequest, NextApiResponse } from 'next'
import { defaultHandler } from "ra-data-simple-prisma";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log('api prisma')
	const result = await defaultHandler(req.body, prisma);
	res.json(result);
}
