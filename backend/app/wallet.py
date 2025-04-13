from solders.pubkey import Pubkey  # Lowercase 'pubkey' module
from solders.system_program import TransferParams
from solana.transaction import Transaction
from solana.rpc.api import Client
from solders.system_program import TransferParams  # For params
from solders.system_program import transfer

client = Client("https://api.devnet.solana.com")

def send_usdc(sender_privkey: str, receiver: str, amount: float):
    """Send USDC on Solana Devnet (test tokens only)"""
    sender = Pubkey(sender_privkey)
    receiver = Pubkey(receiver)
    transaction = Transaction().add(
        transfer(TransferParams(
            from_pubkey=sender,
            to_pubkey=receiver,
            lamports=int(amount * 1e6)  # USDC has 6 decimals
        ))
    )
    return client.send_transaction(transaction, sender)
