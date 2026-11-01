import 'package:flutter/material.dart';

import '../models/policy_model.dart';

/// Foreground and background colors for a payment status, tuned per theme.
({Color fg, Color bg}) paymentStatusColors(PaymentStatus status, Brightness brightness) {
  final dark = brightness == Brightness.dark;
  return switch (status) {
    PaymentStatus.pagado => (
        fg: dark ? const Color(0xFF6FD39A) : const Color(0xFF1D7A46),
        bg: dark ? const Color(0xFF173826) : const Color(0xFFE2F3E8),
      ),
    PaymentStatus.porVencer => (
        fg: dark ? const Color(0xFFA3AAC0) : const Color(0xFF6B7285),
        bg: dark ? const Color(0xFF2A3350) : const Color(0xFFEEF0F5),
      ),
    PaymentStatus.vencido => (
        fg: dark ? const Color(0xFFFF8A80) : const Color(0xFFB42318),
        bg: dark ? const Color(0xFF3D1A1A) : const Color(0xFFFDE8E7),
      ),
  };
}

class PaymentStatusChip extends StatelessWidget {
  const PaymentStatusChip({super.key, required this.status});

  final PaymentStatus status;

  @override
  Widget build(BuildContext context) {
    final c = paymentStatusColors(status, Theme.of(context).brightness);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: c.bg, borderRadius: BorderRadius.circular(6)),
      child: Text(
        status.label,
        style: TextStyle(color: c.fg, fontWeight: FontWeight.w600, fontSize: 12),
      ),
    );
  }
}

/// A faint line color for borders, dividers and empty progress tracks that
/// works with any color scheme, including ones without a tuned outlineVariant.
Color subtleLine(ColorScheme scheme) => scheme.onSurface.withValues(alpha: 0.12);
