import re

# Read the HTML file
input_file_path = 'index.html'
output_file_path = 'updated_index.html'

with open(input_file_path, 'r') as file:
    content = file.read()

# Replace all instances of priano.com with tropicgranite.com
content = re.sub(r'priano\.com', 'tropicgranite.com', content)

# Update the form action to point to the new PHP file
content = re.sub(r'action="[^"]*"', 'action="https://tropicgranite.com/contact-us.php"', content)

# Add the JavaScript for redirecting subdomains
redirect_script = '''
<script>
    // JavaScript to redirect subdomains to /sorry
    if (window.location.hostname !== 'tropicgranite.com' && window.location.hostname.endsWith('.tropicgranite.com')) {
        window.location.href = 'https://tropicgranite.com/sorry';
    }
</script>
'''

# Insert the script before the closing </head> tag
content = re.sub(r'(</head>)', redirect_script + r'\1', content, count=1)

# Write the updated content back to a new HTML file
with open(output_file_path, 'w') as file:
    file.write(content)

print(f"Updated HTML content has been saved to {output_file_path}")
