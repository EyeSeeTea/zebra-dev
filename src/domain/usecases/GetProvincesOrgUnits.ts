import { FutureData } from "../../data/api-futures";
import { OrgUnit } from "../entities/OrgUnit";
import { OrgUnitRepository } from "../repositories/OrgUnitRepository";

export class GetProvincesOrgUnits {
    constructor(private orgUnitRepository: OrgUnitRepository) {}

    public execute(): FutureData<OrgUnit[]> {
        return this.orgUnitRepository.getByLevel(2);
    }
}
