import { Provider } from "@nestjs/common"
import { DataSource, getMetadataArgsStorage } from "typeorm"


export const postgresDatabaseProvider: Provider =
{
  provide: 'DataSource',
  useFactory: async () =>
  {
    const dataSource = new DataSource( {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: getMetadataArgsStorage().tables.map( ( table ) => table.target ),
      synchronize: true,
    } )

    try
    {
      if ( !dataSource.isInitialized )
      {
        await dataSource.initialize()
      }
    } catch ( error )
    {
      console.error( error?.message )
    }

    return dataSource
  },
}
