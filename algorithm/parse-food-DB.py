import pandas as pd


def convertFromWIN1252ToUTF8():
    # Convert WIN1252 to UTF-8
    input_file = "C:\\Users\\Linguini\\Downloads\\en.openfoodfacts.org.products.csv"
    output_file = "C:\\Users\\Linguini\\Downloads\\en.openfoodfacts.org.products_utf8.csv"

    with open(input_file, "r", encoding="windows-1252", errors="replace") as infile:
        with open(output_file, "w", encoding="utf-8") as outfile:
            for line in infile:
                outfile.write(line)

def parse():
    # Load the CSV file
    csv_file = 'C:\\Users\\Linguini\\Downloads\\en.openfoodfacts.org.products.csv'
    df = pd.read_csv(csv_file, nrows=0, sep="\t")  # Only read the headers

    # Generate the SQL CREATE TABLE statement
    columns = df.columns
    sql = 'CREATE TABLE food_items (\n'
    sql += ',\n'.join([f'"{col}" TEXT' for col in columns])  # Assuming all columns as TEXT
    sql += '\n);'

    # Output the SQL statement
    print(sql)

convertFromWIN1252ToUTF8()