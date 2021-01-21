import { VisitModule } from './visit.module';

describe('VisitModule', () => {
  let visitModule: VisitModule;

  beforeEach(() => {
    visitModule = new VisitModule();
  });

  it('should create an instance', () => {
    expect(visitModule).toBeTruthy();
  });
});
