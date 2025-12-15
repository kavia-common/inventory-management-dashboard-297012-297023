#!/bin/bash
cd /home/kavia/workspace/code-generation/inventory-management-dashboard-297012-297023/stock_management_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

