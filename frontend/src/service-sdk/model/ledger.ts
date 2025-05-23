/**
 * Propio API
 * Microservice for partner managment
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { LedgerChartOfAccounts } from './ledgerChartOfAccounts';

export interface Ledger { 
    ledger_company_name?: string;
    ledger_id?: number;
    chart_of_accounts?: Array<LedgerChartOfAccounts>;
}