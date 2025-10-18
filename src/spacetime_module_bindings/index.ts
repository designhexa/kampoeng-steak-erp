// Lightweight re-export index for spacetime module bindings used in the app.
// This file intentionally exports a minimal shape so the UI can import it without compile errors.

// Lightweight re-export index for spacetime module bindings used in the app.
// This file intentionally exports a minimal shape so the UI can import it without compile errors.

export type DbConnection = any;

export const DbConnection = {
  builder: () => ({
    withUri: () => ({
      withModuleName: () => ({
        onConnect: () => ({
          onDisconnect: () => ({
            build: () => {
              // noop
            },
          }),
        }),
      }),
    }),
  }),
};

// Common placeholder types exported so generated spacetime files can import them.
export type EventContext = any;
export type Reducer = any;
export type RemoteReducers = any;
export type RemoteTables = any;

// Common enums used across the codebase (as placeholders).
export enum OutletStatus {
  Open = 'Open',
  Closed = 'Closed',
  Renovation = 'Renovation',
  UnderMaintenance = 'Under Maintenance'
}

export enum EmploymentStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Terminated = 'Terminated'
}

export enum CandidateStatus {
  Applied = 'Applied',
  Interview = 'Interview',
  Hired = 'Hired',
  Rejected = 'Rejected'
}

export enum AssetStatus {
  InUse = 'InUse',
  Maintenance = 'Maintenance',
  Broken = 'Broken'
}

export enum TransferStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum DiscountType {
  Percentage = 'Percentage',
  Amount = 'Amount'
}

// User-related placeholders
export type User = any;
export type UserRole = any;

export default {} as any;
