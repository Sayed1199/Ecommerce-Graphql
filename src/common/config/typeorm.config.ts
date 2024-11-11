import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from "@nestjs/typeorm";

export class CarriersDashboardDBConfiguration implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
   
      return {
          name: process.env.DASHBOARD_DB_CONNECTION_NAME,
          type: 'postgres', 
          host: `${process.env.DASHBOARD_DB_HOST}`, 
          port: parseInt(process.env.DASHBOARD_DB_PORT),  
          username: `${process.env.DASHBOARD_DB_USERNAME}`,
          password: `${process.env.DASHBOARD_DB_PASSWORD}`,
          database: `${process.env.DASHBOARD_DB_NAME}`, 
          entities: ["dist/**/*.entity{.ts,.js}"], 
          migrations: ["dist/migrations/*{.ts,.js}"], 
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          //process.env.ENVIRONMENT == "production"? false : true,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: true,
              ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUPU4ykEP+B9SrXdxe1uZAZ6mQNvUwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvYWJmMWJmYmItNWZmNy00OTVkLTg3ZjMtMWQyMzYxNWZj
NzIwIFByb2plY3QgQ0EwHhcNMjQwNjAyMDk1MjQ0WhcNMzQwNTMxMDk1MjQ0WjA6
MTgwNgYDVQQDDC9hYmYxYmZiYi01ZmY3LTQ5NWQtODdmMy0xZDIzNjE1ZmM3MjAg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBALSQOcyj
Kp3iMiRq231I1xTJkX/S8kUcS1ihSfUoTcyjB91+ddw9W6Lv855C75YsGeK4uQD1
3bGf3cvBR0oZoTGQPwt6dcomtPiPNs4LvLiXm7rBDsNAcydh5S3Dei5ECROU3zFo
s4AHIDcIgw4DpeXiGKjfdWhvqQu6UkqlJFfzz+y3LO4goRsdJtYu6L7hBswb8pFH
x47AzdP1g/Av79ecqh7oexPI5EnmTHBpaj91jihUUWtRWDjBJGf+TqPwFXldW0IR
PVFzI6Q3u2kDfCLHmP4EMl8R4oYArjGFYJKvMv1JUfOtNXrCIyEFk3T4nO+GMugz
obKUGOcetQgAjngYlbCCUIJFr4w08CCNCMLxope8UmH8XrfhLM2t4WUF1Hs02Xd+
gPqxYS8ZYoAKmvvxqKUaeYjhz4Pw/AKG+hB5TS3bjrZe/SA373p0IqhA+RLQUbkF
O/GnUZj5tIuPuTRRehP4tusHePhG4pyN35JCQPxI3O9F5pRywd44x3aUlQIDAQAB
oz8wPTAdBgNVHQ4EFgQURQAq10h5RJWJvmes9Lg5WazDhXQwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAC5sqiF3L+1rDKjg
qmcemduAnZPZ9PU06gh/AjbJqJNlOI0k5v2aPWf4GdtIPEmCOrl+qh+ZwXRVcCom
f1hF+fIxutw4GLcBx1VqyiTwH1tvfeMFz/uMJAICJsjPhhAKL1IkjepwP7RDmKfh
sv0COvpVkAaNVEeqOvLkFiaShcohnjhBdS8U358G9zW/GFB1GwHC3eYz+Ulw0X8c
6BqLgLNuDlIin/TeR6MI8niC181y7M3Tjz4f2z3MiJGYu1VTyKbCXm7kKsDw7BYZ
XqA3vrqeG60M8j/6iKqoHSLeUuvtYFU0lVhbNkHkbXAI3ho7N0ZH3ijIgRLYEHxy
4U3huwUHU6ZmADwMhBKDwmMX6Fi3xwsg2W2NtdX2ZXbq86f2V4VKCFRGFehPliHG
cdc5iTkgUp2m9TU959yNZjAxZ9BbE8MR0IEAo2IPDHkK9EM2+peMRaXGIWrlacY4
L/500qyK92a386r0nv+pnvXjpBwnYFgQMAosoWTUoBoL0ChMBA==
-----END CERTIFICATE-----`,

            },
          }, 
          
      };
    }
  } 