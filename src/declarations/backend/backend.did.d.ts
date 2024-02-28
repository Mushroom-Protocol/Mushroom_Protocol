import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface DataProject {
  'impact' : string,
  'projectDuration' : bigint,
  'startupID' : string,
  'problemSolving' : string,
  'team' : Array<string>,
  'implementation' : string,
  'yoursolution' : string,
  'productStatus' : string,
  'coverImage' : [] | [Uint8Array | number[]],
  'projectTitle' : string,
  'fundsRequired' : bigint,
  'budget' : Array<string>,
  'milestones' : Array<string>,
}
export interface IncomingStartUp {
  'tlr' : bigint,
  'startUpSlogan' : string,
  'fullNameTl' : string,
  'specializationTL' : string,
  'country' : string,
  'logo' : Uint8Array | number[],
  'email' : string,
  'website' : string,
  'startupStatus' : string,
  'linkedinTL' : string,
  'shortDes' : string,
  'startUpName' : string,
  'industry' : string,
}
export interface Project {
  'impact' : string,
  'projectDuration' : bigint,
  'weeklyReports' : Array<Report>,
  'documents' : Array<Uint8Array | number[]>,
  'startupID' : string,
  'problemSolving' : string,
  'tokenAddress' : Array<Principal>,
  'team' : Array<string>,
  'implementation' : string,
  'yoursolution' : string,
  'productStatus' : string,
  'approvalDate' : bigint,
  'coverImage' : [] | [Uint8Array | number[]],
  'nftCollections' : Array<Principal>,
  'projectTitle' : string,
  'projectId' : string,
  'fundsRequired' : bigint,
  'budget' : Array<string>,
  'milestones' : Array<string>,
}
export interface ProjectCard {
  'problemSolving' : string,
  'owner' : Principal,
  'coverImage' : [] | [Uint8Array | number[]],
  'projectTitle' : string,
  'startupName' : string,
  'pojectID' : string,
}
export type ProjectID = string;
export interface Report {
  'markDown' : string,
  'timestamp' : bigint,
  'images' : Array<Uint8Array | number[]>,
}
export type Result = { 'ok' : IncomingStartUp } |
  { 'err' : string };
export type Result_1 = { 'ok' : DataProject } |
  { 'err' : string };
export type Result_2 = { 'ok' : string } |
  { 'err' : string };
export type Role = { 'Startup' : Array<string> } |
  { 'Minter' : Array<string> } |
  { 'Admin' : null };
export interface Startup {
  'tlr' : bigint,
  'startUpSlogan' : string,
  'fullNameTl' : string,
  'specializationTL' : string,
  'documents' : Array<Uint8Array | number[]>,
  'startupId' : string,
  'country' : string,
  'projects' : Array<string>,
  'owner' : Principal,
  'admissionDate' : bigint,
  'logo' : Uint8Array | number[],
  'email' : string,
  'website' : string,
  'valoration' : bigint,
  'startupStatus' : string,
  'linkedinTL' : string,
  'shortDes' : string,
  'startUpName' : string,
  'industry' : string,
}
export interface StartupCard {
  'startupId' : string,
  'owner' : Principal,
  'logo' : Uint8Array | number[],
  'shortDes' : string,
  'startUpName' : string,
}
export type StartupID = string;
export interface User {
  'verified' : { 'Code' : string } |
    { 'Success' : null },
  'admissionDate' : bigint,
  'userId' : UserId,
  'name' : string,
  'email' : string,
  'principalID' : Principal,
  'roles' : Array<Role>,
  'avatar' : [] | [Uint8Array | number[]],
}
export type UserId = string;
export interface _SERVICE {
  'addControllers' : ActorMethod<[Array<Principal>], boolean>,
  'approveProject' : ActorMethod<[Principal], Result_2>,
  'approveStartUp' : ActorMethod<
    [IncomingStartUp, bigint, Principal],
    Result_2
  >,
  'editProfile' : ActorMethod<
    [[] | [string], [] | [string], [] | [Uint8Array | number[]]],
    [] | [User]
  >,
  'enterVerificationCode' : ActorMethod<[string], Result_2>,
  'expandProject' : ActorMethod<[string], [] | [Project]>,
  'getCodeVerification' : ActorMethod<[], Result_2>,
  'getIncomingProjectByOwner' : ActorMethod<[Principal], Result_1>,
  'getIncomingProjects' : ActorMethod<[], Array<ProjectCard>>,
  'getIncomingStartUps' : ActorMethod<[], Array<StartupCard>>,
  'getIncomingStartupByOwner' : ActorMethod<[Principal], Result>,
  'getMyUser' : ActorMethod<[], [] | [User]>,
  'getProjectByID' : ActorMethod<[string], [] | [Project]>,
  'getProjectsByStartup' : ActorMethod<[string], [] | [Array<ProjectID>]>,
  'getProjectsFromStartup' : ActorMethod<[string], Array<Project>>,
  'getProjectsPreview' : ActorMethod<[], Array<ProjectCard>>,
  'getStartUpByID' : ActorMethod<[string], [] | [Startup]>,
  'getStartUpsByPrincipal' : ActorMethod<[Principal], Array<StartupID>>,
  'getUsers' : ActorMethod<[], Array<[Principal, User]>>,
  'loadAvatar' : ActorMethod<[[] | [Uint8Array | number[]]], [] | [User]>,
  'registerProject' : ActorMethod<[DataProject], string>,
  'registerStartUp' : ActorMethod<[IncomingStartUp], string>,
  'rejectProject' : ActorMethod<[Principal], [] | [DataProject]>,
  'rejectStartUp' : ActorMethod<[Principal], [] | [IncomingStartUp]>,
  'removeControllers' : ActorMethod<[Array<Principal>], boolean>,
  'signUp' : ActorMethod<
    [string, string, [] | [Uint8Array | number[]]],
    [] | [User]
  >,
  'whoAmi' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
