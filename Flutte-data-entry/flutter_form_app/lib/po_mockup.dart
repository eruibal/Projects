import 'package:flutter/material.dart';

class PurchaseOrderScreen extends StatelessWidget {
  const PurchaseOrderScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
          padding: const EdgeInsets.all(24.0),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1000), // Max width for wider screens
            child: Center(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildHeaderCard(),
                  const SizedBox(height: 24),
                  _buildDetailsCard(),
                  const SizedBox(height: 24),
                  _buildSummaryFooter(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderCard() {
    return Card(
      color: const Color(0xFF1E293B),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
      ),
      elevation: 8,
      shadowColor: Colors.black.withValues(alpha: 0.5),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Purchase Order',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
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
            const Divider(height: 32, color: Color(0xFF334155)),
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
                      _buildInfoRow('PO Number:', 'PO-2023-0892', isBold: true),
                      const SizedBox(height: 8),
                      _buildInfoRow('Date:', 'Oct 24, 2023'),
                      const SizedBox(height: 8),
                      _buildInfoRow('Payment Terms:', 'Net 30'),
                      const SizedBox(height: 8),
                      _buildInfoRow('Expected Delivery:', 'Nov 01, 2023'),
                    ],
                  ),
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

  Widget _buildInfoRow(String label, String value, {bool isBold = false}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.end,
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

  Widget _buildDetailsCard() {
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
            padding: const EdgeInsets.all(20.0),
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
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              headingRowColor: WidgetStateProperty.all(const Color(0xFF0F172A).withValues(alpha: 0.5)),
              dataRowMaxHeight: 65,
              dataRowMinHeight: 65,
              dividerThickness: 1,
              columns: const [
                DataColumn(label: Text('Item Code', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)))),
                DataColumn(label: Text('Description', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)))),
                DataColumn(label: Text('Qty', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8))), numeric: true),
                DataColumn(label: Text('Unit Price', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8))), numeric: true),
                DataColumn(label: Text('Total', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF94A3B8))), numeric: true),
              ],
              rows: const [
                DataRow(cells: [
                  DataCell(Text('LAP-X1-PRO', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('X1 Pro Developer Laptop\n16GB RAM, 512GB SSD', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('5', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('\$1,299.00', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('\$6,495.00', style: TextStyle(fontWeight: FontWeight.w600, color: Colors.white))),
                ]),
                DataRow(cells: [
                  DataCell(Text('MON-4K-27', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('27" 4K IPS Monitor\nUSB-C PD', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('10', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('\$349.00', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('\$3,490.00', style: TextStyle(fontWeight: FontWeight.w600, color: Colors.white))),
                ]),
                DataRow(cells: [
                  DataCell(Text('MOU-WL-MX', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('Wireless Productivity Mouse', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('10', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('\$89.00', style: TextStyle(color: Color(0xFFE2E8F0)))),
                  DataCell(Text('\$890.00', style: TextStyle(fontWeight: FontWeight.w600, color: Colors.white))),
                ]),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryFooter() {
    return Align(
      alignment: Alignment.centerRight,
      child: Container(
        width: 350,
        padding: const EdgeInsets.all(24.0),
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
