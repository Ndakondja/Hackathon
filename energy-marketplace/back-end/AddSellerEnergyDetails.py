from pyteal import *

def marketplace_contract():
    on_creation = Seq([
        App.globalPut(Bytes("seller1"), Txn.sender()),
        App.globalPut(Bytes("seller1_email"), Bytes("seller1@example.com")),
        App.globalPut(Bytes("seller1_energy_type"), Bytes("Solar")),
        App.globalPut(Bytes("seller1_quantity"), Int(1000)),
        App.globalPut(Bytes("seller1_price"), Int(10)),

        App.globalPut(Bytes("seller2"), Addr("HFFYGRLUGU45ZH7RXDH7Z3DDYGSPMIJMZH6IYD2BSKU6CHSUPHVQ7TR6FY")),
        App.globalPut(Bytes("seller2_email"), Bytes("seller2@example.com")),
        App.globalPut(Bytes("seller2_energy_type"), Bytes("Wind")),
        App.globalPut(Bytes("seller2_quantity"), Int(2000)),
        App.globalPut(Bytes("seller2_price"), Int(15)),

        App.globalPut(Bytes("seller3"), Addr("YFFAUTBNCE42C7HPDCCFYNUZ4HWQIKIBSCLRMVJUFBL3CP5OLR4ZK3AVEE")),
        App.globalPut(Bytes("seller3_email"), Bytes("seller3@example.com")),
        App.globalPut(Bytes("seller3_energy_type"), Bytes("Hydro")),
        App.globalPut(Bytes("seller3_quantity"), Int(1500)),
        App.globalPut(Bytes("seller3_price"), Int(12)),

        Return(Int(1))
    ])

    program = Cond(
        [Txn.application_id() == Int(0), on_creation]
    )

    return program

if __name__ == "__main__":
    with open('marketplace.teal', 'w') as f:
        compiled = compileTeal(marketplace_contract(), mode=Mode.Application)
        f.write(compiled)
