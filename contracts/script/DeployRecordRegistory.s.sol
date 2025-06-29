// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {RecordRegistory} from "../src/RecordRegistory.sol";

contract DeployRecordRegistory is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        RecordRegistory recordRegistory = new RecordRegistory();
        vm.stopBroadcast();
    }
}