
# Test an API with ease
export extern "mimetes" [
    --help(-h)                     # Print usage information
    --version(-v)                  # Print version
]

# Run a proxy server to record http requests and responses and create a test suite
export extern "mimetes mime" [
    host: string                   # The API serveur http(s) address
    --port(-p): int                # The proxy port to mime on             (default 8080)
    --name(-n): string             # The name of the test suite            (default "custom")
    --report-dir(-d): string       # The directory to save the test suite  (default ".")
    --help(-h)                     # Print usage information
    --include-methods: string      # A comma separated list of methods to include
    --exclude-methods: string      # A comma separated list of methods to exclude
    --include-paths: string        # A comma separated list of paths globs pattern to include
    --exclude-paths: string        # A comma separated list of path globs pattern to exclude
]

#Run all requests and check the responses against the recorded responses.
export extern "mimetes test" [
    ...test_files: string          # The test suite
    --base(-b): string             # Base URL to use for requests
    --help(-h)                     # Print usage information
    --verbose(-v)                  # Print verbose output
    --debug(-d)                    # If an error occurs, write the expected and actual on actual.json and expected.json
    --interactive(-i)              # Run in interactive mode
    --ignore-props: string         # A comma separated list of ignored properties in body comparison
]
