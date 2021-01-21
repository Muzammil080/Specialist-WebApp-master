import { AzureModule } from './azure.module';

describe('AzureModule', () => {
  let azureModule: AzureModule;

  beforeEach(() => {
    azureModule = new AzureModule();
  });

  it('should create an instance', () => {
    expect(azureModule).toBeTruthy();
  });
});
