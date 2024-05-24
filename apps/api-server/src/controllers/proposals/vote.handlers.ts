import config from '#config'
import type { Context } from 'hono'
import type { MongoClient } from 'mongodb'
import type { DatabaseUser } from '#services/db'
import { getUserEnforcer } from '#services/permissions'
import { MongoCollection } from '@kreyolopal/domain'

const upvote = async function (c: Context) {
	const logger = c.get('logger')
	const client: MongoClient = c.get('mongodb')
	const user: DatabaseUser = c.get('user')

	const { entry, definition_id } = c.req.param()
	const aWord = entry.trim()

	logger.info(`upvote definition ${definition_id} for  ${aWord}`)

	if (!user) {
		logger.debug('user not logged in')
		return c.json({ error: 'You are not logged in.' }, 403)
	}
	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('vote', 'proposals')) {
		logger.debug('user does not have vote proposals permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}


	//find entry in proposal
	const filter = { entry: aWord, docType: 'entry' }
	const proposal = client
		.db(config.mongodb.database)
		.collection(MongoCollection.proposals)

	const found = await proposal.countDocuments(filter)
	logger.debug(`found ${found} entries for ${aWord}`)

	if (found === 0) return c.json({ error: 'Not Found.' }, 404)

	const updateDoc = {
		$pull: {
			downvoters: {
				user: user.id,
			},
		},
	}
	const entryFilter = {
		entry: aWord,
		docType: 'definition',
		definition_id: definition_id,
	}

	let modified = await proposal.updateOne(entryFilter, updateDoc)
	logger.debug(JSON.stringify(modified))

	if (modified.modifiedCount > 0) return c.json({ message: 'Vote added.' }, 200)

	modified = await proposal.updateOne(
		entryFilter,
		{ $addToSet: { upvoters: { user: user.id, birthdate: user.birth_date } } },
		{ upsert: true }
	)

	return c.json({ message: 'Vote added.' }, 200)
}

const downvote = async function (c: Context) {
	const logger = c.get('logger')
	const client: MongoClient = c.get('mongodb')
	const user: DatabaseUser = c.get('user')

	const { entry, definition_id } = c.req.param()
	const aWord = entry.trim()

	logger.info(`downvote definition ${definition_id} for  ${aWord}`)

	if (!user) {
		logger.debug('user not logged in')
		return c.json({ error: 'You are not logged in.' }, 403)
	}
	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('vote', 'proposals')) {
		logger.debug('user does not have vote proposals permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}


	//find entry in proposal
	const filter = { entry: aWord, docType: 'entry' }
	const proposal = client
		.db(config.mongodb.database)
		.collection(MongoCollection.proposals)

	const found = await proposal.countDocuments(filter)
	logger.debug(`found ${found} entries for ${aWord}`)

	if (found === 0) return c.json({ error: 'Not Found.' }, 404)

	const updateDoc = {
		$pull: {
			upvoters: {
				user: user.id,
			},
		},
	}
	const entryFilter = {
		entry: aWord,
		docType: 'definition',
		definition_id: definition_id,
	}

	let modified = await proposal.updateOne(entryFilter, updateDoc)
	logger.debug(JSON.stringify(modified))

	if (modified.modifiedCount > 0) return c.json({ message: 'Vote added.' }, 200)

	modified = await proposal.updateOne(
		entryFilter,
		{
			$addToSet: { downvoters: { user: user.id, birthdate: user.birth_date } },
		},
		{ upsert: true }
	)

	return c.json({ message: 'Vote added.' }, 200)
}

const getVotes = async function (c: Context) {
	const logger = c.get('logger')
	const client: MongoClient = c.get('mongodb')
	const user: DatabaseUser = c.get('user')

	const { entry, definition_id } = c.req.param()
	const aWord = entry.trim()

	logger.info(`get votes on ${definition_id} for  ${aWord}`)

	if (!user) {
		logger.debug('user not logged in')
		return c.json({ error: 'You are not logged in.' }, 403)
	}

	const enforcer = await getUserEnforcer(user)

	if (!enforcer.can('read', 'proposals')) {
		logger.debug('user does not have read proposals permission')
		return c.json({ error: 'Unsufficient permissions.' }, 403)
	}

	//find entry in proposal
	const proposal = client
		.db(config.mongodb.database)
		.collection(MongoCollection.proposals)
	const filter = {
		entry: aWord,
		docType: 'definition',
		definition_id: definition_id,
	}
	const projection = { _id: 0, upvoters: 1, downvoters: 1 }

	const item = await proposal.findOne(filter, { projection })
	if (item === null) return c.json({ error: 'Not Found.' }, 404)

	return c.json(item, 200)
}

export default {
	upvote,
	downvote,
	getVotes,
}
