contract:
	cat erc721factory/artifacts/contracts/RaremintsERC721.sol/RaremintsERC721.json  | jq .abi > frontend/src/app/contract_definitions/erc721.json
