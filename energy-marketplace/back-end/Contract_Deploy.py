from algosdk.v2client import algod
from algosdk.transaction import ApplicationCallTxn, LogicSigTransaction,StateSchema
from algosdk import mnemonic, account
import base64

# Initialize an algod client
algod_address = "https://testnet-algorand.api.purestake.io/ps2"
algod_token = "5vYgmsOoW02XVU1Xb8PLm9gizCZODOyY39RZfaOL"
headers = {
    "X-API-Key": algod_token,
}
client = algod.AlgodClient(algod_token, algod_address, headers)

# compile teal code
with open("marketplace.teal", "r") as f:
    source = f.read()

response = client.compile(source)
print("Response Result = ", response['result'])
print("Response Hash = ", response['hash'])

# get teal program
program = base64.b64decode(response['result'])

# get your account's passphrase
passphrase = "law skirt empower trim pilot camp drip supreme barely spawn again dizzy royal large version awake distance auto zebra cliff dwarf device two abandon inch"
private_key = mnemonic.to_private_key(passphrase)
public_key = account.address_from_private_key(private_key)
print("Private key", private_key)
print("Public key:", public_key)

# create a transaction
# create a transaction
params = client.suggested_params()
txn = ApplicationCallTxn(
    sender=public_key,
    sp=params,
    index=0,
    accounts=[public_key],
    on_complete=0,
    approval_program=program,
    clear_program=program,
    global_schema=StateSchema(num_uints=9, num_byte_slices=12),
    local_schema=StateSchema(num_uints=0, num_byte_slices=0)
)


# sign the transaction
signed_txn = txn.sign(private_key)
sent_txn = client.send_transaction(signed_txn)
