import csv
import sys

def csv_to_markdown(csv_path, md_path):
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.reader(f)
        rows = list(reader)

    if not rows:
        return

    max_cols = max(len(row) for row in rows)

    for row in rows:
        row.extend([''] * (max_cols - len(row)))

    with open(md_path, 'w', encoding='utf-8') as f:
        header = rows[0]
        f.write('| ' + ' | '.join(header) + ' |\n')
        f.write('|' + '|'.join(['---'] * max_cols) + '|\n')
        
        for row in rows[1:]:
            cleaned_row = [cell.replace('\n', '<br>').replace('\r', '').replace('|', '\\|') for cell in row]
            f.write('| ' + ' | '.join(cleaned_row) + ' |\n')

if __name__ == "__main__":
    csv_to_markdown("Code changes Analysis.csv", "Code changes Analysis.md")
