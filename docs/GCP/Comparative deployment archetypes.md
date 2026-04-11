| Deployment Archetype | Availability | Outage Robustness (Zone / Region) | Cost | Operational Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Zonal** | 99.9% | Hours or days RTO for both | Low | Simplest to set up and operate. |
| **Regional** | 99.99% | Near-zero RTO for zone / Hours or days RTO for region | Medium | More complex than zonal due to multiple zones. |
| **Multi-regional** | 99.999% | Near-zero RTO for both | High (due to redundant storage and cross-region traffic) | More complex than regional. |
| **Global** | 99.999% | Near-zero RTO for both | Medium | Potentially simpler than multi-regional, but requires careful global resource management. |
| **Hybrid & Multicloud** | Depends on system interdependencies and redundancy. | Depends on the robustness of each separate environment. | Variable, but includes extra networking, monitoring, and management costs. | Highest, requiring consistent provisioning and security management across differing platforms. |

*Note: The near-zero RTO values assume synchronous data replication.*
