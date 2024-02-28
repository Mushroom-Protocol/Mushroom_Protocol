export const idlFactory = ({ IDL }) => {
  const Result_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const IncomingStartUp = IDL.Record({
    'tlr' : IDL.Nat,
    'startUpSlogan' : IDL.Text,
    'fullNameTl' : IDL.Text,
    'specializationTL' : IDL.Text,
    'country' : IDL.Text,
    'logo' : IDL.Vec(IDL.Nat8),
    'email' : IDL.Text,
    'website' : IDL.Text,
    'startupStatus' : IDL.Text,
    'linkedinTL' : IDL.Text,
    'shortDes' : IDL.Text,
    'startUpName' : IDL.Text,
    'industry' : IDL.Text,
  });
  const UserId = IDL.Text;
  const Role = IDL.Variant({
    'Startup' : IDL.Vec(IDL.Text),
    'Minter' : IDL.Vec(IDL.Text),
    'Admin' : IDL.Null,
  });
  const User = IDL.Record({
    'verified' : IDL.Variant({ 'Code' : IDL.Text, 'Success' : IDL.Null }),
    'admissionDate' : IDL.Int,
    'userId' : UserId,
    'name' : IDL.Text,
    'email' : IDL.Text,
    'principalID' : IDL.Principal,
    'roles' : IDL.Vec(Role),
    'avatar' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Report = IDL.Record({
    'markDown' : IDL.Text,
    'timestamp' : IDL.Int,
    'images' : IDL.Vec(IDL.Vec(IDL.Nat8)),
  });
  const Project = IDL.Record({
    'impact' : IDL.Text,
    'projectDuration' : IDL.Nat,
    'weeklyReports' : IDL.Vec(Report),
    'documents' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'startupID' : IDL.Text,
    'problemSolving' : IDL.Text,
    'tokenAddress' : IDL.Vec(IDL.Principal),
    'team' : IDL.Vec(IDL.Text),
    'implementation' : IDL.Text,
    'yoursolution' : IDL.Text,
    'productStatus' : IDL.Text,
    'approvalDate' : IDL.Int,
    'coverImage' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'nftCollections' : IDL.Vec(IDL.Principal),
    'projectTitle' : IDL.Text,
    'projectId' : IDL.Text,
    'fundsRequired' : IDL.Nat,
    'budget' : IDL.Vec(IDL.Text),
    'milestones' : IDL.Vec(IDL.Text),
  });
  const DataProject = IDL.Record({
    'impact' : IDL.Text,
    'projectDuration' : IDL.Nat,
    'startupID' : IDL.Text,
    'problemSolving' : IDL.Text,
    'team' : IDL.Vec(IDL.Text),
    'implementation' : IDL.Text,
    'yoursolution' : IDL.Text,
    'productStatus' : IDL.Text,
    'coverImage' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'projectTitle' : IDL.Text,
    'fundsRequired' : IDL.Nat,
    'budget' : IDL.Vec(IDL.Text),
    'milestones' : IDL.Vec(IDL.Text),
  });
  const Result_1 = IDL.Variant({ 'ok' : DataProject, 'err' : IDL.Text });
  const ProjectCard = IDL.Record({
    'problemSolving' : IDL.Text,
    'owner' : IDL.Principal,
    'coverImage' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'projectTitle' : IDL.Text,
    'startupName' : IDL.Text,
    'pojectID' : IDL.Text,
  });
  const StartupCard = IDL.Record({
    'startupId' : IDL.Text,
    'owner' : IDL.Principal,
    'logo' : IDL.Vec(IDL.Nat8),
    'shortDes' : IDL.Text,
    'startUpName' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IncomingStartUp, 'err' : IDL.Text });
  const Startup = IDL.Record({
    'tlr' : IDL.Nat,
    'startUpSlogan' : IDL.Text,
    'fullNameTl' : IDL.Text,
    'specializationTL' : IDL.Text,
    'documents' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'startupId' : IDL.Text,
    'country' : IDL.Text,
    'projects' : IDL.Vec(IDL.Text),
    'owner' : IDL.Principal,
    'admissionDate' : IDL.Int,
    'logo' : IDL.Vec(IDL.Nat8),
    'email' : IDL.Text,
    'website' : IDL.Text,
    'valoration' : IDL.Nat,
    'startupStatus' : IDL.Text,
    'linkedinTL' : IDL.Text,
    'shortDes' : IDL.Text,
    'startUpName' : IDL.Text,
    'industry' : IDL.Text,
  });
  return IDL.Service({
    'addControllers' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'approveProject' : IDL.Func([IDL.Principal], [Result_2], []),
    'approveStartUp' : IDL.Func(
        [IncomingStartUp, IDL.Nat, IDL.Principal],
        [Result_2],
        [],
      ),
    'editProfile' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [IDL.Opt(User)],
        [],
      ),
    'enterVerificationCode' : IDL.Func([IDL.Text], [Result_2], []),
    'expandProject' : IDL.Func([IDL.Text], [IDL.Opt(Project)], ['query']),
    'getCodeVerification' : IDL.Func([], [Result_2], []),
    'getIncomingProjectByOwner' : IDL.Func([IDL.Principal], [Result_1], []),
    'getIncomingProjects' : IDL.Func([], [IDL.Vec(ProjectCard)], []),
    'getIncomingStartUps' : IDL.Func([], [IDL.Vec(StartupCard)], []),
    'getIncomingStartupByOwner' : IDL.Func([IDL.Principal], [Result], []),
    'getMyUser' : IDL.Func([], [IDL.Opt(User)], []),
    'getProjectByID' : IDL.Func([IDL.Text], [IDL.Opt(Project)], []),
    'getProjectsFromStartup' : IDL.Func([IDL.Text], [IDL.Vec(Project)], []),
    'getProjectsPreview' : IDL.Func([], [IDL.Vec(ProjectCard)], ['query']),
    'getStartUpByID' : IDL.Func([IDL.Text], [IDL.Opt(Startup)], []),
    'getUsers' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, User))], []),
    'loadAvatar' : IDL.Func([IDL.Opt(IDL.Vec(IDL.Nat8))], [IDL.Opt(User)], []),
    'registerProject' : IDL.Func([DataProject], [IDL.Text], []),
    'registerStartUp' : IDL.Func([IncomingStartUp], [IDL.Text], []),
    'rejectProject' : IDL.Func([IDL.Principal], [IDL.Opt(DataProject)], []),
    'rejectStartUp' : IDL.Func([IDL.Principal], [IDL.Opt(IncomingStartUp)], []),
    'removeControllers' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'signUp' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [IDL.Opt(User)],
        [],
      ),
    'whoAmi' : IDL.Func([], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
