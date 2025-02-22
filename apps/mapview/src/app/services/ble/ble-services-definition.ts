import { BleCharacteristicNames } from '../../store/features/ble-sensors.initial-state';

export type ServiceNames = 'pressure' | 'rdac';

export type SettingsCharacteristicNames = 'rpmFactor';

export enum BleBinaryDataType {
  uint32 = 'uint32',
  uint16 = 'uint16',
  uint8 = 'uint8',
  sint32 = 'sint32',
  sint16 = 'sint16',
  sint8 = 'sint8',
  string = 'string',
  float = 'float',
  double = 'double',
}

export interface CharacteristicDefinition {
  name: BleCharacteristicNames;
  id: string;
  dataType: BleBinaryDataType;
}

interface ServiceDefinition {
  id: string;
  required: boolean;
  characteristics: CharacteristicDefinition[];
}

type ServiceDefinitionRecord = Record<ServiceNames, ServiceDefinition>;

export const servicesDefinition: ServiceDefinitionRecord = {
  pressure: {
    id: 'e0833334-0e1d-4b79-ae7f-a4e5792819e9',
    required: true,
    characteristics: [
      {
        name: 'pressure',
        id: '1e49540c-448c-44e7-a518-0a28151b3779',
        dataType: BleBinaryDataType.uint32,
      },
      {
        name: 'temperature',
        id: '3e5047b4-131a-4b31-8bc3-5e338fed6c08',
        dataType: BleBinaryDataType.sint16,
      },
    ],
  },
  rdac: {
    id: '11fafbd4-f9c7-4098-880d-6ce9c9138872',
    required: false,
    characteristics: [
      {
        name: 'rpm',
        id: '4a47079f-4cab-4e10-82fe-60b70e2299b6',
        dataType: BleBinaryDataType.uint32,
      },
      {
        name: 'tc1',
        id: '930b1f39-7fee-4b43-9a76-4bee84bc0029',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'tc2',
        id: '2254e0a2-a8c7-4ac1-a434-24c75c61d8cf',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'tc3',
        id: '57d1f2df-0d65-4e0f-aa17-31243efad10f',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'tc4',
        id: '6fed1034-d8e6-4dfd-ae17-da17a2fe93a2',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'um1',
        id: '8d8e14e1-a32a-4ec8-9d13-e2ce32c699f1',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'um2',
        id: '4f631fb4-ce86-4a24-aed3-fa471cefd7a4',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'um3',
        id: '2680ca6b-c1eb-4671-a640-a1cb297fba48',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'um4',
        id: '1769b0d0-5ff4-40eb-9b60-f52cedde5ebd',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'um5',
        id: '518c9e47-d302-4a1a-bf26-39932dbb01ff',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'um6',
        id: '366a877b-63e6-4971-a576-bcb7787dbb99',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'at1',
        id: '3d3e3011-5f16-4489-85e4-12feeed25a89',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'at2',
        id: 'cfe35d01-aab3-4a1d-ba8c-e9fb97fcdda2',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'at3',
        id: 'fffe3aad-176b-4cab-b6d7-66ed6b9ab3d1',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'at4',
        id: 'fe23c8c7-024b-472a-b276-5ee3f8a975ae',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'au1',
        id: 'c0a58ca2-0904-40bf-a80c-6d6d4428a973',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'au2',
        id: 'e4bf5982-010d-4599-8b89-5cc11ef35be5',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'au3',
        id: 'fb05d2b3-6605-4b51-9878-f40d963a5c51',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'rdacTemp',
        id: '8a833489-7dab-4251-a2ec-2e7b39c3578b',
        dataType: BleBinaryDataType.sint16,
      },
      {
        name: 'oilPressure',
        id: 'efcf9430-9a85-4d81-91b0-4750e58c393e',
        dataType: BleBinaryDataType.uint16,
      },
      {
        name: 'fuelLevel',
        id: '9c05bed7-af71-4070-b560-e36b374316a5',
        dataType: BleBinaryDataType.uint16,
      },
    ],
  },
};

export const settingsCharacteristicsDefinition: Record<
  SettingsCharacteristicNames,
  {
    id: string;
    serviceName: ServiceNames;
    dataType: BleBinaryDataType;
  }
> = {
  rpmFactor: {
    id: 'a48bc93d-65e5-428b-a857-7afb11de3184',
    serviceName: 'rdac',
    dataType: BleBinaryDataType.float,
  },
};
