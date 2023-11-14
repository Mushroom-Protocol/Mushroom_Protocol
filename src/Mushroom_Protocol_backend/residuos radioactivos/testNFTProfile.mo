import nftProfile "nftprofile";
import Types "TypeNftProfile";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";

actor {
    public shared ({caller}) func createColection(_logo: Types.Logo, _name: Text, _symbol: Text):async Principal{
        Cycles.add(7_692_307_692 + 6_153_891_538 + 3_150);
        let myColection = await nftProfile.ProfileNFT(caller, {logo= _logo; name = _name; symbol = _symbol});
        let principalIDColection = Principal.fromActor(myColection);
    };
    public shared ({caller}) func whoami(yo: Text): async (Principal,Text){(caller,yo)};
}