import { Controller, Get } from '@nestjs/common';
import { DNSHealthIndicator, HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private dns: DNSHealthIndicator,
    ) { }

    @Get()
    @HealthCheck()
    check(): Promise<HealthCheckResult> {
        return this.health.check([
            // TODO: Fix the URL based on env
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
            () => this.dns.pingCheck('edge-api', 'http://localhost:3000/api/v1'),

            // TODO: Fix the URL based on env
            // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
            () => this.dns.pingCheck('redis', 'http://localhost:6379'),
        ]);
    }

}