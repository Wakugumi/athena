# Storage Engine Tests

This directory contains comprehensive tests for the Aventurine Storage Engine. The tests cover all components of the storage system including drivers, services, factories, and integration scenarios.

## Test Structure

### Unit Tests

#### Service Tests
- **`storage.service.spec.ts`** - Tests for the main `StorageService` class
  - File upload, download, delete operations
  - Stream handling and conversion
  - URL generation (public and signed)
  - Key parsing and path management
  - Error handling

#### Driver Tests
- **`local.driver.spec.ts`** - Tests for the `LocalDriver` implementation
  - File system operations (read, write, delete, move, copy)
  - Folder creation and existence checks
  - Signed URL generation for local files
  - Error handling for file not found scenarios

- **`azure.driver.spec.ts`** - Tests for the `AzureDriver` implementation
  - Azure Blob Storage operations
  - Connection string vs managed identity authentication
  - SAS token generation for signed URLs
  - Error handling for Azure-specific scenarios

#### Factory Tests
- **`storage-driver.factory.spec.ts`** - Tests for the `StorageDriverFactory`
  - Configuration-based driver creation
  - Support for LOCAL and AZURE storage types
  - Configuration change detection and caching
  - Error handling for invalid configurations

#### Module Tests
- **`storage.module.spec.ts`** - Tests for the `StorageModule`
  - Dependency injection setup
  - Module configuration validation
  - Service availability and exports

#### Type Tests
- **`storage.types.spec.ts`** - Tests for TypeScript type definitions
  - Interface compliance and structure validation
  - Enum value verification
  - Type safety demonstrations

- **`storage.exception.spec.ts`** - Tests for custom exception handling
  - Exception inheritance and error codes
  - Error message formatting

### Integration Tests

#### Full System Tests
- **`storage.integration.spec.ts`** - End-to-end integration tests
  - Complete file lifecycle operations
  - Real file system operations (LOCAL driver)
  - Mock driver integration scenarios
  - Error handling across components

### Test Utilities

#### Testing Infrastructure
- **`storage.test-utils.ts`** - Comprehensive testing utilities
  - `MockStorageDriver` - In-memory driver for testing
  - `createStorageTestingModule()` - Easy test module creation
  - `StorageTestDataFactory` - Test data generation helpers
  - `StorageTestAssertions` - Common assertion patterns
  - Stream utilities for testing

- **`storage.test-utils.spec.ts`** - Tests for the test utilities themselves
  - Validation of mock implementations
  - Test helper functionality verification
  - End-to-end workflow demonstrations

## Running Tests

### All Storage Tests
```bash
npm test -- --testPathPattern=storage
```

### Specific Test Files
```bash
# Service tests
npm test src/engine/storage/services/storage.service.spec.ts

# Driver tests
npm test src/engine/storage/drivers/local.driver.spec.ts
npm test src/engine/storage/drivers/azure.driver.spec.ts

# Integration tests
npm test src/engine/storage/__tests__/storage.integration.spec.ts
```

### Test Coverage
```bash
npm run test:cov -- --testPathPattern=storage
```

### Watch Mode
```bash
npm run test:watch -- --testPathPattern=storage
```

## Test Patterns and Examples

### Basic Service Testing
```typescript
import { createStorageTestingModule } from '../__tests__/storage.test-utils';

describe('MyStorageTest', () => {
  let storageService: StorageService;

  beforeEach(async () => {
    const { module, storageService: service } = await createStorageTestingModule();
    storageService = service;
  });

  it('should upload and retrieve file', async () => {
    await storageService.upload({
      key: 'test.txt',
      source: 'content',
    });

    const exists = await storageService.exists('test.txt');
    expect(exists).toBe(true);
  });
});
```

### Using Test Data Factory
```typescript
import { StorageTestDataFactory } from '../__tests__/storage.test-utils';

it('should handle different file types', async () => {
  const textFile = StorageTestDataFactory.createTextFile('Hello World');
  const imageFile = StorageTestDataFactory.createImageFile('jpeg');
  const largeFile = StorageTestDataFactory.createLargeFile(1024 * 1024);

  // Upload and test each file type
});
```

### Using Test Assertions
```typescript
import { StorageTestAssertions } from '../__tests__/storage.test-utils';

it('should copy files correctly', async () => {
  await storageService.upload({ key: 'source.txt', source: 'content' });
  await storageService.copy('source.txt', 'target.txt');

  await StorageTestAssertions.assertFileCopied(
    storageService,
    'source.txt',
    'target.txt'
  );
});
```

### Mock Driver Testing
```typescript
import { MockStorageDriver } from '../__tests__/storage.test-utils';

it('should work with custom mock behavior', async () => {
  const mockDriver = new MockStorageDriver();
  
  // Pre-populate with test data
  mockDriver.addFile('existing.txt', 'existing content');
  
  const { storageService } = await createStorageTestingModule({
    customDriver: mockDriver,
  });

  const exists = await storageService.exists('existing.txt');
  expect(exists).toBe(true);
});
```

## Testing Strategies

### Unit Testing
- Mock all external dependencies (file system, Azure SDK)
- Test error conditions and edge cases
- Verify method calls and parameter passing
- Test type safety and interface compliance

### Integration Testing
- Use real file system for LOCAL driver tests
- Test complete workflows end-to-end
- Verify component interactions
- Test configuration loading and driver factory

### Mock Testing
- Use `MockStorageDriver` for fast, isolated tests
- Test business logic without I/O overhead
- Verify file lifecycle operations
- Test error scenarios safely

## Key Test Coverage Areas

### Functionality Coverage
- ✅ File upload (string, Buffer, stream sources)
- ✅ File download and reading
- ✅ File deletion
- ✅ File movement and copying
- ✅ File existence checking
- ✅ Folder operations
- ✅ URL generation (public and signed)
- ✅ Metadata handling

### Driver Coverage
- ✅ Local file system operations
- ✅ Azure Blob Storage operations
- ✅ Configuration-based driver selection
- ✅ Error handling and edge cases

### Error Scenarios
- ✅ File not found errors
- ✅ Permission denied errors
- ✅ Invalid configuration errors
- ✅ Network/connectivity errors (Azure)
- ✅ Malformed input handling

### Performance Considerations
- ✅ Stream handling efficiency
- ✅ Large file operations
- ✅ Memory usage in tests
- ✅ Async operation handling

## Extending Tests

### Adding New Driver Tests
1. Create driver-specific test file following naming pattern
2. Mock external SDK dependencies
3. Test all `StorageDriver` interface methods
4. Include error scenarios specific to the driver
5. Add integration tests with real services (optional)

### Adding New Service Features
1. Add unit tests for new methods
2. Include tests in integration scenarios
3. Update test utilities if needed
4. Add examples to this documentation

### Mock Driver Extensions
1. Extend `MockStorageDriver` for new features
2. Add corresponding test utilities
3. Update test examples and documentation
4. Ensure backward compatibility

## Troubleshooting Tests

### Common Issues
- **File system permissions**: Ensure test runner has write access to temp directories
- **Azure SDK mocking**: Update mocks when Azure SDK changes
- **Stream handling**: Be careful with stream lifecycle in tests
- **Async operations**: Always await async operations in tests

### Debug Tips
- Use `console.log()` to debug file paths and operations
- Check temporary directory cleanup in integration tests
- Verify mock function calls with Jest matchers
- Use `--verbose` flag for detailed test output

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add appropriate documentation
3. Ensure tests are deterministic and fast
4. Include both positive and negative test cases
5. Update this README with new patterns or utilities
