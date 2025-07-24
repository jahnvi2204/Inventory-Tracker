import pandas as pd
from datetime import timedelta

# Load the dataset
df = pd.read_csv('products.csv')

# Convert ModifyDate to datetime
df['ModifyDate'] = pd.to_datetime(df['ModifyDate'], errors='coerce')

# Ensure VitalityDays is numeric
df['VitalityDays'] = pd.to_numeric(df['VitalityDays'], errors='coerce').fillna(0)

# Compute expiry date: ModifyDate (purchase date) + VitalityDays (shelf life)
df['expiry_date'] = df['ModifyDate'] + pd.to_timedelta(df['VitalityDays'], unit='d')

# Calculate days to expiry at time of purchase
df['days_to_expiry'] = (df['expiry_date'] - df['ModifyDate']).dt.days

# Simulate discount based on days_to_expiry
def simulate_discount(days):
    if pd.isna(days):
        return None
    days = int(days)
    if days > 30:
        return 0
    elif days > 15:
        return 10
    elif days > 7:
        return 20
    elif days > 2:
        return 40
    elif days >= 0:
        return 60
    else:
        return 100  # Expired at time of purchase

df['discount'] = df['days_to_expiry'].apply(simulate_discount)

# Keep only relevant columns
final_df = df[['ProductID', 'CategoryID', 'Price', 'days_to_expiry', 'discount']]

# Save cleaned dataset
final_df.to_csv('fixed_cleaned_products.csv', index=False)

# Preview the result
print(final_df.head())
