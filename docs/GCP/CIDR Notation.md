Here's how CIDR notation works, broken down with an interactive explorer:

**The core idea** is simple: an IP address is 32 bits. The `/prefix` number tells you how many of those bits belong to the *network*, and the rest belong to *hosts*. The larger the prefix, the smaller the network.

For example, `192.168.1.0/24` means:
- First **24 bits** → locked in as the network address
- Last **8 bits** → free to assign to hosts (that's 2⁸ = 256 addresses, minus 2 reserved = **254 usable hosts**)

### Key rules to remember

**Two reserved addresses per subnet** — every block loses its first address (the network address) and last address (the broadcast). That's why a `/24` gives you 254 hosts, not 256.

**The prefix math:**
- `/24` → 2⁸ = 256 total, 254 usable — the classic home/office LAN
- `/30` → 2² = 4 total, 2 usable — perfect for point-to-point router links
- `/32` → exactly 1 address — used to identify a single host (like a loopback)
- `/0` → the entire internet (`0.0.0.0/0`), used as the "default route"

**Subnet mask** is just the prefix expressed as four decimal octets. `/24` = `255.255.255.0` means the first three octets are all 1s (network) and the last is all 0s (host). The widget shows you this translation automatically.

**CIDR lets you split big blocks into smaller ones (subnetting)** — for example, you can take a `/24` and divide it into two `/25` networks, or four `/26` networks, and so on. Each time you add 1 to the prefix, you cut the address space in half.