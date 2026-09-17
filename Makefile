.PHONY: install dev build lint test

install:
	pnpm install

dev:
	pnpm --parallel \
		--filter @invoice/api \
		--filter @invoice/web \
		dev

build:
	pnpm build

lint:
	pnpm lint

test:
	pnpm test
