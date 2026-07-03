#!/bin/bash
cd "$(dirname "$0")/.."
ADMIN=https://nhapoa-admin-uat.mosje.in
USER=https://nhapoa-user-uat.mosje.in
run(){ echo "=== $1 ==="; python3 engine/cap_role.py "${@:2}" 2>&1; }
run CITIZEN --base $USER --prefix CITIZEN
run DO      --base $ADMIN --user ba.districtofficer --pw 'NHAPOA@123' --prefix DO
run STATE   --base $ADMIN --user ba.stateauthority  --pw 'NHAPOA@123' --prefix STATE
run FIN     --base $ADMIN --user ba.financeofficer  --pw 'NHAPOA@123' --prefix FIN
run CENTRAL --base $ADMIN --user ba.centralauthority --pw 'NHAPOA@123' --prefix CENTRAL
run SYS     --base $ADMIN --user nhapoa_sysadmin --pw 'Nhapoa@2026#' --prefix SYS
run SHO     --base $ADMIN --user westdeopur_ps1  --pw 'NHAPOA@123' --prefix SHO
echo "ALL DONE"
