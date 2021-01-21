import { MobileAppModule } from './mobile-app.module';

describe('MobileAppModule', () => {
  let mobileAppModule: MobileAppModule;

  beforeEach(() => {
    mobileAppModule = new MobileAppModule();
  });

  it('should create an instance', () => {
    expect(mobileAppModule).toBeTruthy();
  });
});
