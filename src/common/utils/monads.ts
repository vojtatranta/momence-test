export class Maybe<T> {
	private value: T | null | undefined;

	constructor(value: T | null | undefined) {
		this.value = value;
	}

	static of<NV>(value: NV | null | undefined) {
		return new Maybe<NV>(value);
	}

	map<R>(mapper: (value: NonNullable<T>) => R): Maybe<R> {
		if (this.value !== null && typeof this.value !== 'undefined') {
			return new Maybe<R>(mapper(this.value));
		}

		return new Maybe<R>(null);
	}

	then<R>(functr: (value: T | null | undefined) => R): R {
		return functr(this.value);
	}

	andThenWithDefault<D>(defaultValue: D): NonNullable<T> | D {
		return this.value || defaultValue;
	}
}
