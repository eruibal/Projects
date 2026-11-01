import 'models.dart';

// Demo data only: names, policy number, UUIDs and folios are made up.
// Amounts and dates follow a real monthly schedule so the layout is realistic.

// UTC dates keep day differences exact across DST changes.
DateTime _d(int day, int month, int year) => DateTime.utc(year, month, day);

const _transfer = '03 Transferencia electrónica';
const _card = '04 Tarjeta de crédito';

final samplePolicy = Policy(
  number: '00000X00',
  paymentFrequency: 'Mensual',
  people: const [
    'Titular de Ejemplo',
    'Asegurado de Ejemplo 1',
    'Asegurado de Ejemplo 2',
  ],
  start: _d(5, 6, 2026),
  end: _d(5, 6, 2027),
  cutoff: _d(31, 10, 2026),
  receipts: [
    Receipt(number: 1, from: _d(5, 6, 2026), to: _d(5, 7, 2026), amount: 14133.23, paidOn: _d(1, 7, 2026), paymentMethod: _transfer, uuid: '00000000-0000-4000-8000-000000000001', folio: 'DEMO 000001'),
    Receipt(number: 2, from: _d(5, 7, 2026), to: _d(5, 8, 2026), amount: 11987.24, paidOn: _d(4, 8, 2026), paymentMethod: _transfer, uuid: '00000000-0000-4000-8000-000000000002', folio: 'DEMO 000002'),
    Receipt(number: 3, from: _d(5, 8, 2026), to: _d(5, 9, 2026), amount: 11987.24, paidOn: _d(1, 9, 2026), paymentMethod: _transfer, uuid: '00000000-0000-4000-8000-000000000003', folio: 'DEMO 000003'),
    Receipt(number: 4, from: _d(5, 9, 2026), to: _d(5, 10, 2026), amount: 11987.24, paidOn: _d(2, 10, 2026), paymentMethod: _transfer, uuid: '00000000-0000-4000-8000-000000000004', folio: 'DEMO 000004'),
    Receipt(number: 5, from: _d(5, 10, 2026), to: _d(5, 11, 2026), amount: 11987.24, paidOn: _d(30, 10, 2026), paymentMethod: _card),
    for (var i = 6; i <= 12; i++)
      Receipt(
        number: i,
        from: _d(5, (i + 4) % 12 + 1, i <= 7 ? 2026 : 2027),
        to: _d(5, (i + 5) % 12 + 1, i <= 6 ? 2026 : 2027),
        amount: 11987.24,
      ),
  ],
);
