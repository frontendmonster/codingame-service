import mongoose from 'mongoose';

import { MongoosePuzzleDoc, PuzzleModel } from '../models/mongoosePuzzleModel';
import { MongoosePuzzleConfig } from '../config/mongoose.config';
import { Logger } from '../config';

import PuzzleRepo from './puzzleRepo';

interface BaseMongoosePuzzleRepo extends PuzzleRepo {
	connect: (config: MongoosePuzzleConfig) => Promise<void>;
	getOneRandomPuzzle: () => Promise<MongoosePuzzleDoc | null>;
	getPuzzleById: (id: string) => Promise<MongoosePuzzleDoc | null>;
}

class MongoosePuzzleRepo implements BaseMongoosePuzzleRepo {
	private logger: Logger;
	constructor(config: MongoosePuzzleConfig, logger: Logger) {
		this.logger = logger;
		this.connect(config);
	}

	public async connect(config: MongoosePuzzleConfig) {
		try {
			await mongoose.connect(config.url, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			this.logger.info('✅ successfully conected to mongodb codingame db');
		} catch (err) {
			this.logger.info('🥅 error occurred');
			this.logger.error(err);
		}
	}

	public async getPuzzleById(id: string) {
		const puzzle: MongoosePuzzleDoc | null = await PuzzleModel.findById(id);
		return puzzle;
	}

	public async getOneRandomPuzzle() {
		const randomPuzzles: MongoosePuzzleDoc[] = await PuzzleModel.aggregate([
			{ $sample: { size: 1 } },
		]);
		const [randomPuzzle] = randomPuzzles;

		return randomPuzzle;
	}
}

export default MongoosePuzzleRepo;
