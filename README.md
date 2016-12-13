# Run
### Follow the README.md in webserver
```java
cd webserver
```
# [Demo Website](http://104.197.212.131:8111/)
####(Referential integrity for hosting may not hold.)

# Demo Video
[![demo](https://img.youtube.com/vi/PF8eC2LBkVw/0.jpg)](https://www.youtube.com/watch?v=PF8eC2LBkVw)

# ER Diagrams
![](https://github.com/micklinISgood/DealNear/blob/master/img/ER.png)
# Snapshots
###Display total on-sale product count for each location within bound for a query location
```sql
select l.latitude,l.longitude,l.name,n.count from locations as l, 
(select count(*), pl.lid from set_ploc as pl , post as p where p.pid=pl.pid and p.status=0 and pl.lid 
IN (select lid from locations where latitude >= %s and longitude >= %s and  latitude <= %s 
and longitude <= %s) group by pl.lid) as n where n.lid=l.lid;
```
![Map](https://github.com/micklinISgood/DealNear/blob/master/img/dealnear2016-12-09%2011.24.05%20AM.png)

###Display 5 most recent inbox records
```sql
Select msg.*, users.name from (select max(bi.time),bi.to_id from (
    Select time, to_id as from_id, from_id as to_id, text from msg
    union
    Select * from msg ) as bi where bi.from_id = %s group by bi.to_id) as new, users,msg 
    where users.uid=new.to_id and msg.time=new.max and (msg.to_id=new.to_id or msg.from_id=new.to_id) 
    order by new.max desc limit 5;
```
![inbox](https://github.com/micklinISgood/DealNear/blob/master/img/dealnear2016-12-09%2011.38.29%20AM.png)

###Calculate a seller's rate from each buyer's rating
```sql
select avg(p) from (select avg(point) as p, from_id from rate where to_id=%s and 
        from_id in (select to_id from sell where from_id=%s) group by from_id) as foo 
```
![inbox](https://github.com/micklinISgood/DealNear/blob/master/img/seller_r.png)

### User login/Singup 
![](https://github.com/micklinISgood/DealNear/blob/master/img/dealnear2016-12-09%2011.33.05%20AM.png)

### Post an item for sale
![](https://github.com/micklinISgood/DealNear/blob/master/img/dealnear2016-12-09%2011.33.58%20AM.png)

### Manage User info
![](https://github.com/micklinISgood/DealNear/blob/master/img/dealnear2016-12-09%2011.35.00%20AM.png)

###Rate buyer & Seller & chatting
![](https://github.com/micklinISgood/DealNear/blob/master/img/dealnear2016-12-09%2011.35.23%20AM.png)
![](https://github.com/micklinISgood/DealNear/blob/master//img/dealnear2016-12-09%2011.39.37%20AM.png) 
![](https://github.com/micklinISgood/DealNear/blob/master/img/dealnear2016-12-09%2011.42.06%20AM.png)
![](https://github.com/micklinISgood/DealNear/blob/master/img/dealnear2016-12-09%2011.42.34%20AM.png)
![](https://github.com/micklinISgood/DealNear/blob/master/img/dealnear2016-12-09%2011.43.16%20AM.png)




