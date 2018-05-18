interface DocumentFetcher {
    fetch: (url: string) => string
}

class MockDocumentFetcher implements DocumentFetcher {
    fetch(url: string) {
        return "<html><head><title>Selam</title></head><body><ul><li>1</li><li>2</li></ul></body></html>"
    }
}

export {
    MockDocumentFetcher,
    DocumentFetcher
}