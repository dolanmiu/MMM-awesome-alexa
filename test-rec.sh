rec t.wav& sleep 1; 
kill $!
echo $?

rm t.wav

if [ $? = 0 ]; then
    echo Your mic works perfectly!
    exit 0
else
    echo There is something wrong with your mic
    exit 1
fi
