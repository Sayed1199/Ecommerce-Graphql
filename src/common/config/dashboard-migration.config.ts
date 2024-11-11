import { DataSource, DataSourceOptions } from "typeorm";
import {CarriersDashboardDBConfiguration} from "./typeorm.config";
import * as dotenv from 'dotenv';
dotenv.config();
export const dataSourceConnection = (new CarriersDashboardDBConfiguration()).createTypeOrmOptions() 
export default (new DataSource(dataSourceConnection as DataSourceOptions)); 
