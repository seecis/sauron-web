interface DocumentFetcher {
    fetch: (url: string) => Promise<string>
}

class MockDocumentFetcher implements DocumentFetcher {
    async fetch(url: string) {
        return "<html><head><title>Selam</title></head><body><ul><li>1</li><li>2</li></ul></body></html>"
    }
}

export {
    MockDocumentFetcher,
    DocumentFetcher
}