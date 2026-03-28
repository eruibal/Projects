import 'package:flutter/material.dart';

class PurchaseOrderScreen extends StatelessWidget {
  const PurchaseOrderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.sizeOf(context).width > 768;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Purchase Order Mockup'),
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        scrolledUnderElevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: RadialGradient(
            colors: [
              const Color(0xFF4F46E5).withValues(alpha: 0.15),
              Colors.transparent,
            ],
            center: const Alignment(0.7, -0.7),
            radius: 1.5,
          ),
        ),
        child: SingleChildScrollView(
          padding: EdgeInsets.all(isDesktop ? 24.0 : 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildHeaderCard(isDesktop),
              SizedBox(height: isDesktop ? 24 : 16),
              _buildDetailsCard(isDesktop),
              SizedBox(height: isDesktop ? 24 : 16),
              _buildSummaryFooter(isDesktop),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderCard(bool isDesktop) {
    return Card(
      color: const Color(0xFF1E293B),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
      ),
      elevation: 8,
      shadowColor: Colors.black.withValues(alpha: 0.5),
      child: Padding(
        padding: EdgeInsets.all(isDesktop ? 24.0 : 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    'Purchase Order',
                    style: TextStyle(
                      fontSize: isDesktop ? 24 : 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFF10B981).withValues(alpha: 0.2)),
                  ),
                  child: const Text(
                    'APPROVED',
                    style: TextStyle(
                      color: Color(0xFF10B981),
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            Divider(height: isDesktop ? 32 : 24, color: const Color(0xFF334155)),
            if (isDesktop)
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: _buildInfoColumn(
                      'Vendor Details',
                      'Tech Supplies Corp.\n123 Innovation Drive\nSilicon Valley, CA 94025\ncontact@techsupplies.com',
                    ),
                  ),
                  Expanded(
                    child: _buildInfoColumn(
                      'Shipping Address',
                      'Headquarters\n456 Main Street\nNew York, NY 10001\nAttn: Receiving Dept.',
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        _buildInfoRow('PO Number:', 'PO-2023-0892', isBold: true, isDesktop: isDesktop),
                        const SizedBox(height: 8),
                        _buildInfoRow('Date:', 'Oct 24, 2023', isDesktop: isDesktop),
                        const SizedBox(height: 8),
                        _buildInfoRow('Payment Terms:', 'Net 30', isDesktop: isDesktop),
                        const SizedBox(height: 8),
                        _buildInfoRow('Expected Delivery:', 'Nov 01, 2023', isDesktop: isDesktop),
                      ],
                    ),
                  ),
                ],
              )
            else
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildInfoColumn(
                    'Vendor Details',
                    'Tech Supplies Corp.\n123 Innovation Drive\nSilicon Valley, CA 94025\ncontact@techsupplies.com',
                  ),
                  const SizedBox(height: 20),
                  _buildInfoColumn(
                    'Shipping Address',
                    'Headquarters\n456 Main Street\nNew York, NY 10001\nAttn: Receiving Dept.',
                  ),
                  const SizedBox(height: 20),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildInfoRow('PO Number:', 'PO-2023-0892', isBold: true, isDesktop: isDesktop),
                      const SizedBox(height: 8),
                      _buildInfoRow('Date:', 'Oct 24, 2023', isDesktop: isDesktop),
                      const SizedBox(height: 8),
                      _buildInfoRow('Payment Terms:', 'Net 30', isDesktop: isDesktop),
                      const SizedBox(height: 8),
                      _buildInfoRow('Expected Delivery:', 'Nov 01, 2023', isDesktop: isDesktop),
                    ],
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoColumn(String title, String details) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Color(0xFF94A3B8),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          details,
          style: const TextStyle(
            fontSize: 15,
            height: 1.5,
            color: Color(0xFFE2E8F0),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isBold = false, bool isDesktop = true}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: isDesktop ? MainAxisAlignment.end : MainAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: Color(0xFF94A3B8),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          value,
          style: TextStyle(
            fontSize: 15,
            fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            color: Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildDetailsCard(bool isDesktop) {
    final items = [
      {'code': 'LAP-X1-PRO', 'desc': 'X1 Pro Developer Laptop\n16GB RAM, 512GB SSD', 'qty': '5', 'price': '\$1,299.00', 'total': '\$6,495.00'},
      {'code': 'MON-4K-27', 'desc': '27" 4K IPS Monitor\nUSB-C PD', 'qty': '10', 'price': '\$349.00', 'total': '\$3,490.00'},
      {'code': 'MOU-WL-MX', 'desc': 'Wireless Productivity Mouse', 'qty': '10', 'price': '\$89.00', 'total': '\$890.00'},
    ];

    return Card(
      color: const Color(0xFF1E293B),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
      ),
      elevation: 8,
      shadowColor: Colors.black.withValues(alpha: 0.5),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: EdgeInsets.all(isDesktop ? 20.0 : 16.0),
            child: const Text(
              'Line Items',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ),
          const Divider(height: 1, color: Color(0xFF334155)),
          if (isDesktop)
            Column(
              children: [
                // Table Header
                Container(
                  color: const Color(0xFF0F172A).withValues(alpha: 0.5),
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
                  child: Row(
                    children: const [
                      Expanded(flex: 2, child: Text('Item Code', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)))),
                      Expanded(flex: 4, child: Text('Description', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)))),
                      Expanded(flex: 1, child: Text('Qty', textAlign: TextAlign.right, style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)))),
                      Expanded(flex: 2, child: Text('Unit Price', textAlign: TextAlign.right, style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)))),
                      Expanded(flex: 2, child: Text('Total', textAlign: TextAlign.right, style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)))),
                    ],
                  ),
                ),
                const Divider(height: 1, color: Color(0xFF334155)),
                // Table Rows
                ...items.map((item) {
                  return Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(flex: 2, child: Text(item['code']!, style: const TextStyle(color: Color(0xFFE2E8F0)))),
                            Expanded(flex: 4, child: Text(item['desc']!, style: const TextStyle(color: Color(0xFFE2E8F0)))),
                            Expanded(flex: 1, child: Text(item['qty']!, textAlign: TextAlign.right, style: const TextStyle(color: Color(0xFFE2E8F0)))),
                            Expanded(flex: 2, child: Text(item['price']!, textAlign: TextAlign.right, style: const TextStyle(color: Color(0xFFE2E8F0)))),
                            Expanded(flex: 2, child: Text(item['total']!, textAlign: TextAlign.right, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.white))),
                          ],
                        ),
                      ),
                      const Divider(height: 1, color: Color(0xFF334155)),
                    ],
                  );
                }),
              ],
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: items.length,
              separatorBuilder: (context, index) => const Divider(height: 1, color: Color(0xFF334155)),
              itemBuilder: (context, index) {
                final item = items[index];
                return Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Text(
                              item['desc']!,
                              style: const TextStyle(
                                fontSize: 15,
                                color: Color(0xFFE2E8F0),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Text(
                            item['total']!,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF334155),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              item['code']!,
                              style: const TextStyle(
                                fontSize: 12,
                                color: Color(0xFF94A3B8),
                                fontFamily: 'monospace',
                              ),
                            ),
                          ),
                          Text(
                            '${item['qty']} x ${item['price']}',
                            style: const TextStyle(
                              fontSize: 14,
                              color: Color(0xFF94A3B8),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
    );
  }

  Widget _buildSummaryFooter(bool isDesktop) {
    return Align(
      alignment: isDesktop ? Alignment.centerRight : Alignment.center,
      child: Container(
        width: isDesktop ? 350 : double.infinity,
        padding: EdgeInsets.all(isDesktop ? 24.0 : 16.0),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.5),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.05),
          ),
        ),
        child: Column(
          children: [
            _buildSummaryRow('Subtotal', '\$10,875.00'),
            const SizedBox(height: 12),
            _buildSummaryRow('Tax (8.5%)', '\$924.38'),
            const SizedBox(height: 12),
            _buildSummaryRow('Shipping', '\$50.00'),
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16.0),
              child: Divider(height: 1, color: Color(0xFF334155)),
            ),
            _buildSummaryRow(
              'Total Amount',
               '\$11,849.38',
              isTotal: true,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: isTotal ? 18 : 15,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.w500,
            color: isTotal ? Colors.white : const Color(0xFF94A3B8),
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: isTotal ? 22 : 15,
            fontWeight: isTotal ? FontWeight.bold : FontWeight.w500,
            color: isTotal ? const Color(0xFF4F46E5) : Colors.white,
          ),
        ),
      ],
    );
  }
}
