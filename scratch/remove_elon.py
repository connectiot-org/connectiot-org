import json
import re

# Read index.html
with open('d:/JhatsApp/index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Remove from contactsData
contacts_match = re.search(r'<script id="contactsData" type="application/json">(.*?)</script>', html_content, re.DOTALL)
if contacts_match:
    contacts_data = json.loads(contacts_match.group(1))
    if isinstance(contacts_data, list):
        # Filter out elon-musk
        contacts_data = [c for c in contacts_data if c.get('id') != 'elon-musk']
    elif isinstance(contacts_data, dict):
        if 'elon-musk' in contacts_data:
            del contacts_data['elon-musk']
    
    new_contacts_str = json.dumps(contacts_data, indent=2)
    html_content = html_content.replace(contacts_match.group(1), new_contacts_str)

# Remove from convosData
convos_match = re.search(r'<script id="convosData" type="application/json">(.*?)</script>', html_content, re.DOTALL)
if convos_match:
    convos_json = json.loads(convos_match.group(1))
    if 'elon-musk' in convos_json:
        del convos_json['elon-musk']
    
    new_convos_str = json.dumps(convos_json, indent=2)
    html_content = html_content.replace(convos_match.group(1), new_convos_str)

# Write back to index.html
with open('d:/JhatsApp/index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Removed Elon Musk from index.html successfully.")
