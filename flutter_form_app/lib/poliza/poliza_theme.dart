import 'package:flutter/material.dart';

import 'models.dart';

const navy = Color(0xFF1F3157);
const tabular = [FontFeature.tabularFigures()];
const monoFamilies = ['Menlo', 'SF Mono', 'Roboto Mono', 'Courier New', 'monospace'];

ThemeData buildTheme(Brightness brightness) {
  final scheme = ColorScheme.fromSeed(seedColor: navy, brightness: brightness);
  return ThemeData(
    colorScheme: scheme,
    useMaterial3: true,
    scaffoldBackgroundColor: brightness == Brightness.light ? const Color(0xFFF5F6F9) : const Color(0xFF0F1422),
  );
}

/// Foreground and background for a status pill, tuned per theme.
({Color fg, Color bg, String label}) statusStyle(ReceiptStatus s, Brightness b) {
  final dark = b == Brightness.dark;
  return switch (s) {
    ReceiptStatus.paid => (
        fg: dark ? const Color(0xFF6FD39A) : const Color(0xFF1D7A46),
        bg: dark ? const Color(0xFF173826) : const Color(0xFFE2F3E8),
        label: 'Pagado',
      ),
    ReceiptStatus.next => (
        fg: dark ? const Color(0xFFF3B45A) : const Color(0xFFA15C00),
        bg: dark ? const Color(0xFF3A2A12) : const Color(0xFFFDF0DA),
        label: 'Siguiente',
      ),
    ReceiptStatus.upcoming => (
        fg: dark ? const Color(0xFFA3AAC0) : const Color(0xFF6B7285),
        bg: dark ? const Color(0xFF222A40) : const Color(0xFFEEF0F5),
        label: 'Por vencer',
      ),
  };
}
