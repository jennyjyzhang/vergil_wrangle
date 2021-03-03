# Grouped Bar Plot

counts <- matrix(c(16/1918*100, 57/1860*100, 217/1918*100, 241/1860*100),ncol=2,byrow=TRUE)
colnames(counts) <- c("Fall 2020", "Spring 2021")
rownames(counts) <- c("Hybrid", "In-Person")
counts
barplot(counts, main="Percentage of Hybrid and In-Person Classes",
        xlab="Semester",col=c("blue","red"),
        legend = rownames(counts), beside=TRUE)

# Stacked Bar Plot
barplot(counts, main="Percentage of Hybrid and In-Person Classes",
        xlab="Semester", col=c("blue","red"),
        legend = rownames(counts))

